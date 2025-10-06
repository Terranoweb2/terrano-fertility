import { Channel, M3UParseResult } from '../types';

export function parseM3U(content: string): M3UParseResult {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const channels: Channel[] = [];
  const errors: string[] = [];
  
  let currentChannel: Partial<Channel> = {};
  let vlcOptions: { ua?: string; ref?: string } = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    try {
      // Parse #EXTINF line
      if (line.startsWith('#EXTINF:')) {
        const extinf = parseExtinf(line);
        currentChannel = {
          id: generateChannelId(),
          name: extinf.name,
          logo: extinf.logo,
          group: extinf.group,
          ua: extinf.ua,
          ref: extinf.ref,
          vlcUA: vlcOptions.ua,
          vlcRef: vlcOptions.ref
        };
        vlcOptions = {}; // Reset VLC options after use
      }
      // Parse VLC options
      else if (line.startsWith('#EXTVLCOPT:http-user-agent=')) {
        vlcOptions.ua = line.substring('#EXTVLCOPT:http-user-agent='.length);
      }
      else if (line.startsWith('#EXTVLCOPT:http-referrer=')) {
        vlcOptions.ref = line.substring('#EXTVLCOPT:http-referrer='.length);
      }
      // Parse URL line
      else if (!line.startsWith('#') && line.includes('://')) {
        if (currentChannel.name) {
          const channel: Channel = {
            id: currentChannel.id!,
            name: currentChannel.name,
            url: line,
            type: detectStreamType(line),
            logo: currentChannel.logo,
            group: currentChannel.group,
            ua: currentChannel.ua || currentChannel.vlcUA,
            ref: currentChannel.ref || currentChannel.vlcRef
          };
          
          channels.push(channel);
          currentChannel = {};
        }
      }
    } catch (error) {
      errors.push(`Erreur ligne ${i + 1}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
  
  return { channels, errors };
}

function parseExtinf(line: string): {
  name: string;
  logo?: string;
  group?: string;
  ua?: string;
  ref?: string;
} {
  // Extract the part after #EXTINF:duration,
  const match = line.match(/#EXTINF:([^,]*),(.*)$/);
  if (!match) {
    throw new Error('Format EXTINF invalide');
  }
  
  const [, , nameAndAttributes] = match;
  
  // Extract attributes using regex
  const attributes: Record<string, string> = {};
  const attributeRegex = /(\w+(?:-\w+)*)="([^"]*)"/g;
  let attrMatch;
  
  while ((attrMatch = attributeRegex.exec(nameAndAttributes)) !== null) {
    attributes[attrMatch[1]] = attrMatch[2];
  }
  
  // Extract channel name (everything after the last attribute or the whole string if no attributes)
  let name = nameAndAttributes;
  const lastQuoteIndex = nameAndAttributes.lastIndexOf('"');
  if (lastQuoteIndex !== -1) {
    name = nameAndAttributes.substring(lastQuoteIndex + 1).trim();
  }
  
  // Clean up name
  name = name.replace(/^[,\s]+/, '').replace(/[,\s]+$/, '');
  
  return {
    name: name || 'Canal sans nom',
    logo: attributes['tvg-logo'],
    group: attributes['group-title'],
    ua: attributes['user-agent'],
    ref: attributes['referrer']
  };
}

function detectStreamType(url: string): 'hls' | 'dash' {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('.mpd')) {
    return 'dash';
  }
  return 'hls'; // Default to HLS for .m3u8 and other formats
}

function generateChannelId(): string {
  return `channel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateM3UContent(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.startsWith('#EXTM3U') || trimmed.includes('#EXTINF:');
}

export function getChannelGroups(channels: Channel[]): string[] {
  const groups = new Set<string>();
  channels.forEach(channel => {
    if (channel.group) {
      groups.add(channel.group);
    }
  });
  return Array.from(groups).sort();
}
