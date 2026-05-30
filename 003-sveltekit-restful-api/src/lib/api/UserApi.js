export const userRegister = async ({ username, password, name }) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      name,
    }),
  });
};

export const userLogin = async ({ username, password }) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
};

export const userDetail = async (token) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/current`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

export const userUpdateName = async (token, { name }) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/current`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      name,
    }),
  });
};

export const userUpdatePassword = async (token, { password }) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/current`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      password,
    }),
  });
};

export const userLogout = async (token) => {
  return fetch(`${import.meta.env.VITE_URL_API}/users/logout`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};
