import { Response, Request } from 'express';
import knex from '../database/connection';


class ItemsControler {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');
  
    const serializedItems = items.map(item => {
      return { 
        id: item.id,
        title: item.title,
        image_url: `http://localhost:3333/uploads/${item.image}`,
      };
    });
  
  
    return res.json(serializedItems); 
  }
}

export default ItemsControler;