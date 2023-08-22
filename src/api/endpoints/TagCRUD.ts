import { TagDTO } from '../dto/TagDTO';
import { CrudEndpoint } from '../common/CrudEndpoint';

export class TagCRUD extends CrudEndpoint<TagDTO> {
  constructor() {
    super('tags');
  }
}
