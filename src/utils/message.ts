import { message } from "antd";

export const success = (msg: string, key?: string) => {
    const value = { content: msg, key, duration: 2.5 };
    message.success(value);
};

export const warning = (msg: string, key?: string) => {
    const value = { content: msg, key, duration: 2.5 };
    message.warning(value);
};

export const error = (msg: string, key?: string) => {
    const value = { content: msg, key, duration: 2.5 };
    message.error(value);
};

export const loading = (msg: string, key?: string) => {
    const value = { content: msg, key, duration: 2.5 };
    message.loading(value);
};

// const openMessage = () => {
//     message.loading({ content: 'Loading...', key });
//     setTimeout(() => {
//       message.success({ content: 'Loaded!', key, duration: 2 });
//     }, 1000);
//   };

// const success = () => {
//     message
//         .loading('Action in progress..', 2.5)
//         .then(() => message.success('Loading finished', 2.5))
//         .then(() => message.info('Loading finished is finished', 2.5));
// };