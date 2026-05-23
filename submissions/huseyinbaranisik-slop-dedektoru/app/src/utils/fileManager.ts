import { Paths, File } from 'expo-file-system';

const getDocDir = () => Paths.document;

export const saveToForgeMD = async (reportText: string) => {
  try {
    const file = new File(getDocDir(), 'FORGE.md');
    let existingContent = '';
    
    if (file.exists) {
      existingContent = file.text() + '\n\n';
    }
    
    const newContent = `${existingContent}## Burn-in Raporu (${new Date().toLocaleString()})\n\n${reportText}`;
    file.write(newContent);
    console.log('FORGE.md güncellendi');
    return file.uri;
  } catch (error) {
    console.error('FORGE.md yazılırken hata oluştu:', error);
    throw error;
  }
};

export const saveToBridgeMD = async (summaryText: string) => {
  try {
    const file = new File(getDocDir(), 'BRIDGE.md');
    let existingContent = '';
    
    if (file.exists) {
      existingContent = file.text() + '\n\n';
    }
    
    const newContent = `${existingContent}## Uzman Görüşme Özeti (${new Date().toLocaleString()})\n\n${summaryText}`;
    file.write(newContent);
    console.log('BRIDGE.md güncellendi');
    return file.uri;
  } catch (error) {
    console.error('BRIDGE.md yazılırken hata oluştu:', error);
    throw error;
  }
};

export const readBridgeContext = async () => {
  try {
    const file = new File(getDocDir(), 'BRIDGE.md');
    if (file.exists) {
      return file.text();
    }
    return '';
  } catch (error) {
    console.error('BRIDGE.md okunurken hata:', error);
    return '';
  }
};
