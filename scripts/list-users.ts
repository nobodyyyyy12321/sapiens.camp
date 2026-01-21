import { getUsers, findUserByName } from '../lib/users-firebase';

const nameArg = process.argv[2];

async function main() {
  try {
    if (nameArg) {
      const u = await findUserByName(nameArg);
      if (!u) {
        console.log(`User with name '${nameArg}' not found.`);
        process.exit(0);
      }
      console.log(JSON.stringify(u, null, 2));
      process.exit(0);
    }

    const users = await getUsers();
    console.log(`Found ${users.length} users.`);
    users.forEach(u => console.log(u.name, u.email || '(no email)'));
  } catch (e) {
    console.error('Error listing users:', e);
    process.exit(1);
  }
}

main();
