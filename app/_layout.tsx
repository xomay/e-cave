import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';


export default function RootLayout() {
  /*const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log('Creating database and tables...');
    await db.execAsync('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);');
  };*/
  return (
    //onInit={createDbIfNeeded} is a callback that will be called when the database is opened
    <SQLiteProvider databaseName="db_vins.db" assetSource={{ assetId: require('../assets/db_vins.db') }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found"/>
      </Stack>
    </SQLiteProvider>
  );
}
