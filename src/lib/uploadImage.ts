import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: File): Promise<string> {
  // Generate a unique filename to prevent overwrites
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create a unique file name with the original extension
  const fileName = `${uuidv4()}${path.extname(file.name)}`;
  
  // Define the upload path - ensure this directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, fileName);
  
  // Save the file
  await writeFile(filePath, buffer);
  
  // Return the relative path to the file
  return `/uploads/${fileName}`;
} 
