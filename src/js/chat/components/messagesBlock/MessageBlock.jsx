import React, {Component} from 'react';
import './message-block.less';

export default class MessageBlock extends Component {

    commitInput = (text) => {
        if (text.trim() === '') {
            return;
        }
        this.props.emitMessage(text);
        this.props.setCurrentMessage('');
    };

    handleInput = (ev) => {
        const text = ev.target.value;
        if (ev.key !== 'Enter' || ev.shiftKey) {
            return;
        }
        this.commitInput(text);
    };

    handleEnterButton = () => {
        this.commitInput(this.props.currentMessage);
    };

    setCurrentMessage = (ev) => {
        const text = ev.target.value;
        this.props.setCurrentMessage(text);
    };

    componentDidMount() {
        this.ref = React.createRef();
    }

    getSnapshotBeforeUpdate(){
        console.log('in snapshot');
        let flag = false;
        if (this.ref === null || this.ref.current === null) {
            return null;
        }
        const el = this.ref.current;
        if (el.scrollHeight - el.scrollTop > el.clientHeight) {
            flag = true;
            console.log(flag);
            console.log(el.scrollHeight - el.scrollTop);
            console.log('returning something from snapshot');
            return flag;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, flag) {
        if (this.ref === null || this.ref.current === null) {
            return;
        }
        const el = this.ref.current;
        window.el = el;
        if (flag) {
            return;
        }
        setTimeout(() => el.scrollTop = el.scrollHeight, 100);
        //el.scrollTop = el.scrollHeight;
    }

    render() {
        const {
            messages,
            currentMessage,
            serviceMsg
        }
            = this.props;
        const bannedUsers = [];
        !serviceMsg && bannedUsers.push('system');//не показывать системные сообщения
        const filteredMessages = messages.filter(item => {
            return !!(bannedUsers.indexOf(item.user) === -1);
        });
        let prevUser = null;
        const mElems = filteredMessages.map((item, index) => {
            const user = item.user && item.user !== prevUser ? <div className="chat__user-name">{item.user}</div> : null;
            prevUser = item.user;
            const messageClasses = ['chat__message'];
            if (item.user) {
                messageClasses.push('chat__message_others');
            } else {
                messageClasses.push('chat__message_mine');
            }
            return (
                <div key={index} className={messageClasses.join(' ')}>
                    {user}
                    <div className="chat__message-text">{item.text}</div>
                </div>
            );
        });
        return (
            <>
                <div className="chat__messages" ref={this.ref}>{mElems}</div>
                <div className="text">
                <textarea value={currentMessage}
                       onChange={this.setCurrentMessage}
                       onKeyUp={this.handleInput}
                       autoFocus
                          className="chat__input"
                />
                <button className="chat__button" onClick={this.handleEnterButton}>Send</button>
                </div>
            </>
        );
    }
}