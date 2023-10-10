export const checkIfAuthenticate = () => {
    const token = localStorage.getItem("token");
    return !!token;
}
