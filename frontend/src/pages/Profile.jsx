import { authApi } from "@/Api/axios/axiosConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Profile(){
    const[checkUser, setUser] = useState(null)
    const user = useSelector((state) => state.user.user);

    useEffect(()=>{
        if (!user?.id) {
            return;
        }

        async function fetchUser() {
            try {
                const response = await authApi.get(`/users/user/${user.id}`)
                setUser(response.data.data)
            }
            catch(error){
                console.error("Error fetching user data:", error.message);
            }
        }

        fetchUser()
    }, [user?.id])

    return(
        <div>Profile {checkUser?.firstName +" " + checkUser?.lastName}</div>
    )
}

export default Profile;