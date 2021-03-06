import * as path from 'path';
import { mkdirs, readFile, writeFile } from './compile-util';

const needConvertDirs = ['external', 'src', 'labels'];

export async function json2files(): Promise<void> {
  const content = await readFile('lwc-components-lightning.json');
  const jsonObject = JSON.parse(content.toString());
  for (const item of jsonObject.children) {
    if (!needConvertDirs.includes(item.name)) {
      continue;
    }
    await createDirOrFile(item);
  }
}

async function createDirOrFile(item: any, parentDir: string = '../'): Promise<void> {
  const filePath = path.join(parentDir, item.name);
  if (item.hasOwnProperty('children')) {
    await mkdirs(filePath);
    for (const childItem of item.children) {
      await createDirOrFile(childItem, filePath);
    }
  } else {
    await writeFile(filePath, item.content);
  }
}

json2files();
