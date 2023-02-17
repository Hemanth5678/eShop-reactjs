import { Link } from 'react-router-dom';

import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/scss/styles.scss';
import './SideBar.scss';

import { FaGem, FaGithub, FaLuggageCart, FaTshirt } from 'react-icons/fa';
import { MdDashboard, MdAccountBox, MdVerifiedUser } from 'react-icons/md';
import { adminRoutes } from '~/routes/routes';

const SideBar = ({ collapsed }) => {
  return (
    <ProSidebar collapsed={collapsed}>
      <SidebarHeader>
        <div className="px-5 uppercase font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap tracking-wide h-[72px]">
          <Link to={adminRoutes.default} className="text-black no-underline">
            <span className="leading-[72px] text-xl">E-shop</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem icon={<MdDashboard />}>
            Dashboard
            <Link to={adminRoutes.dashboard} />
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<FaLuggageCart />}>
            Manage Order
            <Link to={adminRoutes.manageOrder} />
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<FaTshirt />}>
            Manage Product
            <Link to={adminRoutes.manageProduct} />
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu title={'Common Manage'} icon={<FaGem />}>
            <MenuItem>
              Manage Category
              <Link to={adminRoutes.manageCategory} />
            </MenuItem>
            <MenuItem>
              Manage Size
              <Link to={adminRoutes.manageSize} />
            </MenuItem>
            <MenuItem>
              Manage Color
              <Link to={adminRoutes.manageColor} />
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<MdAccountBox />}>
            Manage User
            <Link to={adminRoutes.manageUser} />
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<MdVerifiedUser />}>
            My Account
            <Link to={adminRoutes.myAccount} />
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter className="text-center text-white text-sm">
        <div className="my-4 mx-8 p-2 border rounded-3xl bg-black">
          <a
            href="https://github.com/hemanth5678"
            target="_blank"
            className="flex flex-col items-center"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">By Hemanth</span>
          </a>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default SideBar;
