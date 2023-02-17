export const ROUTE_HOME = '/';
export const ROUTE_COLLECTION = '/collection';
export const ROUTE_CART = '/cart';
export const ROUTE_SEARCH = '/search';
export const ROUTE_CHECKOUT = '/checkout';
export const ROUTE_CHECKOUT_SUCCESS = '/checkout/thankyou';
export const ROUTE_LOGIN = '/login';
export const ROUTE_REGISTER = '/register';
export const ROUTE_RECOVER_PASSWORD = '/recover-password';
export const ROUTE_ACCOUNT = '/account';
export const ROUTE_ORDER = '/account/order';
export const ROUTE_ORDER_DETAIL = '/account/order/:orderId';
export const ROUTE_CHANGE_PASSWORD = '/account/change-password';



export const ROUTE_ADMIN_DEFAULT = '/admin';
export const ROUTE_ADMIN_DASHBOARD = '/admin/dashboard';
export const ROUTE_ADMIN_MANAGE_ORDER = '/admin/manage-order';
export const ROUTE_ADMIN_MANAGE_CATEGORY = '/admin/manage-category';
export const ROUTE_ADMIN_MANAGE_SIZE = '/admin/manage-size';
export const ROUTE_ADMIN_MANAGE_COLOR = '/admin/manage-color';
export const ROUTE_ADMIN_MANAGE_PRODUCT = '/admin/manage-product';
export const ROUTE_ADMIN_MANAGE_USER = '/admin/manage-user';
export const ROUTE_ADMIN_MYACCOUNT = '/admin/my-account';


const publicRoutes = {
  home: '/',
  collection: '/collection',
  cart: '/cart',
  search: '/search',
  checkout: '/checkout',
  checkoutSuccess: '/checkout/thankyou',
};

const privateRoutes = {
  login: '/login',
  register: '/register',
  recoverPassword: '/recover-password',
  account: '/account',
  order: '/account/order',
  orderDetail: '/account/order/:orderId',
  changePassword: '/account/change-password',
};

const adminRoutes = {
  default: '/admin',
  dashboard: '/admin/dashboard',
  manageOrder: '/admin/manage-order',
  manageCategory: '/admin/manage-category',
  manageSize: '/admin/manage-size',
  manageColor: '/admin/manage-color',
  manageProduct: '/admin/manage-product',
  manageUser: '/admin/manage-user',
  myAccount: '/admin/my-account',
};

export { publicRoutes, privateRoutes, adminRoutes };
