import Entity from './Entity';
import {Tag} from "./Tag";

export class Product implements Entity {
  public id?: string;
  public name = '';
  public categoryId = '';
  public description = '';
  public hidden = false;
  public tagIds: string[] = [];
  public tags: Tag[] = [];
  public thumbnail: string;

  constructor(initData: Partial<Product>) {
    Object.assign(this, initData);
  }
}
