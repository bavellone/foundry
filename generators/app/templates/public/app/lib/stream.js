/*eslint-env browser */
import Rx from 'rxjs';

/**
 * The RxStream manages the connections of a new Observer/Observable pair.
 * Once initialized, the stream can be subscribed to or triggered by consumers and
 * producers.
 */
export class RxStream {
	constructor() {
		this.active = false;
		this.stdout = Rx.Observable.create(observer => {
			this.stdin = observer;
			this.active = true;
		}).publish();
		this.stdout.connect();
	}
	emit(msg) {
		this.stdin.onNext(msg);
		return this;
	}
	emitMsg(...args) {
		this.emit(new Msg(...args));
		return this;
	}
	listen(type, fn) {
		return this.stdout.subscribe(msg => {
			if (msg.type == type)
				fn(msg)
		});
	}
	listenAll(fn) {
		return this.stdout.subscribe(msg => {
			fn(msg);
		});
	}
	close() {
		this.stdin.onComplete();
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
