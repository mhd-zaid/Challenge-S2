export default function checkAuthentication() {
    const token = localStorage.getItem("token");
    return !!token;
}