import fs from 'fs';

export const readDockerSecret = (secretNameAndPath: string) => {
  try {
    return fs.readFileSync(`${secretNameAndPath}`, 'utf8')?.trim();
  } catch (err) {
    console.debug(
      `Could not find the secret, probably not running in swarm mode: ${secretNameAndPath}.`,
      err
    );
  }
};
