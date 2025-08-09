import { UserContext } from "@/providers/userProvider";
import React from "react";

function Profile() {
    const context = React.useContext(UserContext);
    
    if (!context) {
        return <p>Error: UserContext not found</p>;
    }
    
    const { user, handleNewUser } = context;
    
    if(user === undefined) {
        return <p>No user logged in</p>
    }
    return <h1> {user.name} </h1>;
}
export default Profile;