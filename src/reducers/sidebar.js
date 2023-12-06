export const sidebarOpen = () => {
  return {
    type: 'SIDEBAR_OPEN',
  };
};

export const sidebarClose = () => {
  return {
    type: 'SIDEBAR_CLOSE',
  };
};

const initialState = {
  open: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SIDEBAR_OPEN':
      return {
        ...state,
        open: true,
      };
    case 'SIDEBAR_CLOSE':
      return {
        ...state,
        open: false,
      };
    default:
      return state;
  }
}
