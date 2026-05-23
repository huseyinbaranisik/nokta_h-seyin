import * as FileSystem from 'expo-file-system';

export const saveToForgeMD = async (reportText: string) => {
  try {
    const fileUri = FileSystem.documentDirectory + 'FORGE.md';
    let existingContent = '';
    
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      existingContent = await FileSystem.readAsStringAsync(fileUri) + '\n\n';
    }
    
    const newContent = `${existingContent}## Burn-in Raporu (${new Date().toLocaleString()})\n\n${reportText}`;
    await FileSystem.writeAsStringAsync(fileUri, newContent);
    console.log('FORGE.md güncellendi:', fileUri);
    return fileUri;
  } catch (error) {
    console.error('FORGE.md yazılırken hata oluştu:', error);
    throw error;
  }
};

export const saveToBridgeMD = async (summaryText: string) => {
  try {
    const fileUri = FileSystem.documentDirectory + 'BRIDGE.md';
    let existingContent = '';
    
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      existingContent = await FileSystem.readAsStringAsync(fileUri) + '\n\n';
    }
    
    const newContent = `${existingContent}## Uzman Görüşme Özeti (${new Date().toLocaleString()})\n\n${summaryText}`;
    await FileSystem.writeAsStringAsync(fileUri, newContent);
    console.log('BRIDGE.md güncellendi:', fileUri);
    return fileUri;
  } catch (error) {
    console.error('BRIDGE.md yazılırken hata oluştu:', error);
    throw error;
  }
};

export const readBridgeContext = async () => {
    try {
        const fileUri = FileSystem.documentDirectory + 'BRIDGE.md';
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (fileInfo.exists) {
            return await FileSystem.readAsStringAsync(fileUri);
        }
        return '';
    } catch (error) {
        console.error('BRIDGE.md okunurken hata:', error);
        return '';
    }
}
