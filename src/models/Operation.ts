import moment from 'moment';

class Operation {
	date: string;
	amount: number;
	type: string;
	tags?: string[]; // id тегов
	constructor(amount: number, type: 'increase' | 'decrease') {
		this.date = moment().format('DD.MM.YYYY HH:mm');
		this.amount = amount;
		this.type = type;
	}
}

export default Operation;
