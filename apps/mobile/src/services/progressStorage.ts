import { documentDirectory, getInfoAsync, readAsStringAsync, writeAsStringAsync, moveAsync } from 'expo-file-system/legacy';
import type { ProgressStorage } from './mockTrainingService';

function paths() {
  if (!documentDirectory) throw new Error('Diretório de documentos indisponível.');
  return { file: `${documentDirectory}aex-training-v1.json`, temporary: `${documentDirectory}aex-training-v1.pending` };
}

export const progressStorage: ProgressStorage = {
  async read() {
    const { file, temporary } = paths();
    if ((await getInfoAsync(file)).exists) return readAsStringAsync(file);
    // Recupera o temporário se o aplicativo fechar durante a substituição.
    return (await getInfoAsync(temporary)).exists ? readAsStringAsync(temporary) : null;
  },
  async write(value) {
    const { file, temporary } = paths();
    await writeAsStringAsync(temporary, value);
    await moveAsync({ from: temporary, to: file });
  },
};
