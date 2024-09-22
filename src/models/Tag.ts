import { nanoid } from 'nanoid';

class Tag {
	Id: string;
	Name: string;
	constructor(name: string) {
		this.Id = nanoid();
		this.Name = name;
	}
}

export default Tag;
