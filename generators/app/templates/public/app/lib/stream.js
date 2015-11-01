/*eslint-env browser */
import Rx from 'rx';

/**
 * The RxStream manages the connections of a new Observer/Observable pair.
 * Once initialized, the stream can be subscribed to or triggered by consumers and
 * producers.
 */
export class RxStream {
	constructor() {
		this.stream = new Rx.Subject();
	}
	emit(msg) {
		this.stream.onNext(msg);
		return this;
	}
	emitMsg(...args) {
		this.emit(new Msg(...args));
		return this;
	}
	listen(type) {
		return this.stream
			.filter((msg) => msg.type == type)
			.pluck('data');
	}
	listenAll() {
		return this.stream;
	}
	close() {
		this.stream.onCompleted();
		return this;
	}
}


/**
 * The Msg class is used to provide structure to messages passed over an RxStream.
 */
export class Msg {
	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
}
