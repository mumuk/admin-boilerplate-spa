import { CategoryDTO } from './CategoryDTO';
import {TagDTO} from "./TagDTO";
export interface ProductDTO {
  id?: string;
  name: string;
  categoryId?: string;
  description?: string;
  category?: CategoryDTO;
  hidden?: boolean;
  tagIds?: string[];
  tags?: TagDTO[];
  thumbnail?: string;
}
