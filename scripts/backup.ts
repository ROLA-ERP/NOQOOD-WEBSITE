// Makes a backup right now:  npm run db:backup   (safe while the site is running)
import { backupNow, backupDir } from '../src/lib/backup';
console.log(`Backup written: ${backupDir()}/${backupNow()}`);
