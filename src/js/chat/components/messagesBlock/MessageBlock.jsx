import React, {Component} from 'react';
import './message-block.less';

export default class MessageBlock extends Component {
    emitMessage = (ev) => {
        const text = ev.target.value;
        if (text.trim() === '' || ev.key !== 'Enter' || ev.shiftKey) {
            return;
        }
        //.replace(/(?:\r\n|\r|\n)/g, '<br>')
        this.props.emitMessage(text);
        this.props.setCurrentMessage('');
    };
    setCurrentMessage = (ev) => {
        const text = ev.target.value;
        this.props.setCurrentMessage(text);
    };

    componentDidMount() {
        this.ref = React.createRef();
    }

    getSnapshotBeforeUpdate(){
        let flag = false;
        if (this.ref === null || this.ref.current === null) {
            return null;
        }
        const el = this.ref.current;
        if (el.scrollHeight - el.scrollTop > el.clientHeight) {
            flag = true;
            console.log(flag);
            console.log(el.scrollHeight - el.scrollTop);
            return flag;
        }
        return null;
    }

    componentDidUpdate(a, b, flag) {
        if (this.ref === null || this.ref.current === null) {
            return;
        }
        const el = this.ref.current;
        window.el = el;
        if (flag) {
            return;
        }
        el.scrollTop = el.scrollHeight + 100;
    }

    render() {
        const {
            messages,
            currentMessage
        }
            = this.props;
        const mElems = messages.map((item, index) => {
            const user = item.user ? <div>{item.user}: </div> : null;
            return (
                <div key={index} className="chat__message">
                    {user}
                    <div>{item.text}</div>
                </div>
            );
        });
        return (
            <>
                <div className="chat__messages" ref={this.ref}>{mElems}</div>
                <textarea value={currentMessage}
                       onChange={this.setCurrentMessage}
                       onKeyUp={this.emitMessage}
                       autoFocus
                          className="chat__input"
                />
            </>
        );
    }
}