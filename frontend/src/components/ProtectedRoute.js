import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({children})=>{
    const {admin, loading} = useAuth();
    if (loading) return <div>Загрузка...</div>

    if(!admin) return <Navigate to="/login" replace/>

    return children;
}

export default ProtectedRoute;