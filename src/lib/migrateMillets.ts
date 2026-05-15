import { millets } from '../data/millets';
import { addMillet } from './milletService';

/**
 * Run this function once to upload all your local millet data to Firebase.
 * You can call this from your main App component or a hidden admin button.
 */
export const migrateMilletsToFirebase = async () => {
  console.log("Starting migration...");
  try {
    for (const millet of millets) {
      await addMillet(millet);
      console.log(`Uploaded: ${millet.name}`);
    }
    console.log("Migration complete! All millets are now in Firebase.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
};
