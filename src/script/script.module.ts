import { Module } from '@nestjs/common';
import { ScriptsService } from './script.service';
import { ScriptController } from './script.controller';
import { Script, ScriptSchema } from 'src/schema/script.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Script.name, schema: ScriptSchema},
    
      ]),
    ],
  controllers: [ScriptController],
  providers: [ScriptsService],
})
export class ScriptModule {}
