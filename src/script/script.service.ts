import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Script, ScriptDocument, SubtitleSegment } from 'src/schema/script.schema';
import { Model } from 'mongoose';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';

import * as fs from 'fs';

@Injectable()
export class ScriptsService {
  constructor(
    @InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,
  ) {}

  private parseLine(line: string) {
    // Accepts extra spaces and both '-' and '–'
    const match = line.trim().match(/^\[(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\]\s+(.*)$/);
    if (!match) {
      console.error('Failed to parse line:', JSON.stringify(line));
      return null;
    }
    const [, startTime, endTime, text] = match;
    return { startTime, endTime, text };
  }

  // Main import function
  async importScriptsFromTxt(
    podcastId: number,
    translateAudio?: string
  ) {
    const viPath = "./viescript.txt";
    const enPath = "./engscript.txt";
    const [viContent, enContent] = await Promise.all([
      fs.promises.readFile(viPath, 'utf-8'),
      fs.promises.readFile(enPath, 'utf-8'),
    ]);
    const viLines = viContent.split('\n').filter(l => l.trim());
    const enLines = enContent.split('\n').filter(l => l.trim());

    if (viLines.length !== enLines.length) {
      throw new Error('Files do not have the same number of lines');
    }

    // Parse and pair segments
    const segments: SubtitleSegment[] = [];
    for (let i = 0; i < enLines.length; i++) {
      const viSeg = this.parseLine(viLines[i]);
      const enSeg = this.parseLine(enLines[i]);
      if (!viSeg || !enSeg) {
        throw new Error(`Failed to parse line ${i + 1}`);
      }
      // Prefer using EN time codes, but you can check for mismatches here if needed
      segments.push({
        startTime: enSeg.startTime,
        endTime: enSeg.endTime,
        text: enSeg.text,
        textVi: viSeg.text,
      });
    }

    // Save to DB
    const script = new this.scriptModel({
      podcastId,
      segments,
      translateAudio,
    });
    await script.save();
    return script;
  }
  async findByPodcastId(podcastId: number): Promise<Script | null> {
    return this.scriptModel.findOne({ podcastId }).lean();
  }
}
