import { Avatar, Card } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux';

// personal is a tab in profile page which shows user name and email
function Personal() {
  const {user} = useSelector((state)=>state.users);
  return (
    <div>
        <Card>
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
          title={user.username}
          description={
            <>
              <p>Email: {user.email}</p>
            </>
          }
        />
        </Card>
    </div>
  )
}

export default Personal;