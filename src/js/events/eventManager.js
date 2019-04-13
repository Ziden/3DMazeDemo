class EventManager {

    constructor() {
        this.listeners = {};
        this.fire = this.fire.bind(this);
        this.on = this.on.bind(this);
    }

    fire (event)  {
        const eventName = event.constructor.name;
        if(this.listeners[eventName] !== undefined)
            this.listeners[eventName].forEach(e => e(event));
    }

    on (event, callback) {
        const eventName = event.name;
        if(this.listeners[eventName] !== undefined)
            this.listeners[eventName].push(callback);
        else
            this.listeners[eventName] = [callback];
    }
};

export default new EventManager()
