
export interface PodcastEpisode {
    title: string;
    description: string;
    audioUrl: string;
    image: string;
  }
  
  export interface Podcast {
    artistId: number;
    collectionId: number;
    trackId: number;
    artistName: string;
    collectionName: string;
    trackName: string;
    artworkUrl100: string;
    feedUrl: string;
    channelImage: string;
    episodes: PodcastEpisode[];
  }
  