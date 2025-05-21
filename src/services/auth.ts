export const isLoggedIn = () => {
  return !!localStorage.getItem('token'); // hoặc bất kỳ logic auth nào bạn đang dùng
};
