import React from 'react'
import {Tabs} from "antd";
import ProjectPage from './ProjectPage';
import Personal from './Personal';

// profile page contains projects and personal tabs
// projects lists projects created by user
function Profile() {
  const items = [
    {
      key: '1',
      label: 'Projects',
      children: <ProjectPage />,
    },
    {
      key: '2',
      label: 'Personal',
      children: <Personal />,
    }
  ];
  return (
    <Tabs defaultActiveKey='1' items={items} />
  )
}

export default Profile;