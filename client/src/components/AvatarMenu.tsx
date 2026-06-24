import { Settings } from 'lucide-react';
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_IMG } from "../App";
import { PreferencesModal } from "./PreferencesModal";
import {
  carrotIcon,
  librabryIcon,
  profileIcon,
  writeBlogIcon,
  writeSmallIcon,
} from "../assets/icons";
import { useAuth } from "../contexts/Auth";

export default function AvatarMenu() {
  const { isAuthenticated, user, logout } = useAuth();
  return isAuthenticated ? (
    <AuthMenu
      avatar={user!.avatar}
      email={user!.email}
      userId={user!._id}
      role={user!.role}
      logout={logout}
    />
  ) : (
    <UnAuthMenu />
  );
}

function UnAuthMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (
    event: MouseEvent<HTMLImageElement | HTMLSpanElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      className="avatar"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "3px",
      }}
    >
      <img
        onClick={handleClick}
        style={{
          width: "32px",
          height: "32px",
          objectFit: "cover",
          borderRadius: "50%",
          border: "1px solid #334155",
          cursor: "pointer",
        }}
        src={DEFAULT_IMG}
        alt=""
      />
      <span
        onClick={handleClick}
        style={{ color: "rgba(117, 117, 117, 1)", cursor: "pointer" }}
      >
        {carrotIcon}
      </span>
      <Menu
        PaperProps={{
          style: {
            width: 250,
            padding: "10px 0",
            borderRadius: "4px",
            marginTop: "10px",
          },
        }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <GetStarted />
      </Menu>
    </div>
  );
}

function AuthMenu({
  avatar,
  email,
  userId,
  role,
  logout,
}: {
  avatar: string;
  email: string;
  userId: string;
  role?: string;
  logout(): void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (
    event: MouseEvent<HTMLImageElement | HTMLSpanElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      className="avatar"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "3px",
      }}
    >
      <img
        onClick={handleClick}
        style={{
          width: "32px",
          height: "32px",
          objectFit: "cover",
          borderRadius: "50%",
          border: "1px solid #334155",
          cursor: "pointer",
        }}
        src={avatar ?? DEFAULT_IMG}
        alt=""
      />
      <span
        onClick={handleClick}
        style={{ color: "rgba(117, 117, 117, 1)", cursor: "pointer" }}
      >
        {carrotIcon}
      </span>

      <Menu
        PaperProps={{
          style: {
            width: 240,
            padding: "10px 0",
            borderRadius: "4px",
            marginTop: "10px",
          },
        }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Link
          to={`/`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MenuItem
            sx={[{ "&:hover": { backgroundColor: "transparent" } }]}
            onClick={handleClose}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "8px 18px",
            }}
          >
            <span
              style={{ color: "gray", margin: "0 10px", marginBottom: "-5px" }}
            >
              {librabryIcon}
            </span>
            <p
              style={{ marginLeft: "5px", color: "#6b6a6a", fontSize: "14px" }}
            >
              Dashboard
            </p>
          </MenuItem>
        </Link>
        <Link
          to={`/user/${userId}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MenuItem
            sx={[{ "&:hover": { backgroundColor: "transparent" } }]}
            onClick={handleClose}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "8px 18px",
            }}
          >
            <span
              style={{ color: "gray", margin: "0 10px", marginBottom: "-5px" }}
            >
              {profileIcon}
            </span>
            <p
              style={{ marginLeft: "5px", color: "#6b6a6a", fontSize: "14px" }}
            >
              Profile
            </p>
          </MenuItem>
        </Link>
        {(userId === "demo_admin_123" || role === "Admin" || role === "Super Admin" || email === "nowadmin@gmail.com") && (
          <Link
            to={`/admin/certificates`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <MenuItem
              sx={[{ "&:hover": { backgroundColor: "transparent" } }]}
              onClick={handleClose}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                padding: "8px 18px",
              }}
            >
              <span
                style={{ color: "gray", margin: "0 10px", marginBottom: "-5px" }}
              >
                {writeSmallIcon}
              </span>
              <p
                style={{ marginLeft: "5px", color: "#6b6a6a", fontSize: "14px" }}
              >
                Certificates
              </p>
            </MenuItem>
          </Link>
        )}
        {/* Admin Link if role is Admin or Super Admin */}
        {(userId === "demo_admin_123" || role === "Admin" || role === "Super Admin" || email === "nowadmin@gmail.com") && (
           <Link
             to={`/admin/users`}
             style={{ textDecoration: "none", color: "inherit" }}
           >
             <MenuItem
               sx={[{ "&:hover": { backgroundColor: "transparent" } }]}
               onClick={handleClose}
               style={{
                 display: "flex",
                 flexDirection: "row",
                 alignItems: "center",
                 padding: "8px 18px",
               }}
             >
               <span
                 style={{ color: "gray", margin: "0 10px", marginBottom: "-5px", display: "flex", alignItems: "center" }}
               >
                 <Settings className="w-[18px] h-[18px] text-[#6b6a6a]" />
               </span>
               <p
                 style={{ marginLeft: "5px", color: "#6b6a6a", fontSize: "14px" }}
               >
                 Admin Dashboard
               </p>
             </MenuItem>
           </Link>
        )}
        <MenuItem
          sx={[{ "&:hover": { backgroundColor: "transparent" } }]}
          onClick={() => {
            handleClose();
            setIsPreferencesOpen(true);
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "8px 18px",
          }}
        >
          <span
            style={{ color: "gray", margin: "0 10px", marginBottom: "-5px", display: "flex", alignItems: "center" }}
          >
            <Settings className="w-[18px] h-[18px] text-[#6b6a6a]" />
          </span>
          <p
            style={{ marginLeft: "5px", color: "#6b6a6a", fontSize: "14px" }}
          >
            Preferences
          </p>
        </MenuItem>
        <Divider sx={{ margin: "10px 0" }} />
        <MenuItem
          sx={[{ "&:hover": { backgroundColor: "transparent" } }]}
          onClick={() => {
            handleClose();
            logout();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px 25px",
          }}
        >
          <p
            style={{
              color: "#6b6a6a",
              fontSize: "14px",
              marginBottom: "4px",
              marginTop: "2px",
            }}
          >
            Sign out
          </p>
          <span
            style={{ color: "gray", fontSize: "13.75px", marginBottom: "-3px" }}
          >
            {email}
          </span>
        </MenuItem>
      </Menu>
      <PreferencesModal 
        isOpen={isPreferencesOpen} 
        onClose={() => setIsPreferencesOpen(false)} 
      />
    </div>
  );
}

export function GetStarted({
  style,
  topStyle,
}: {
  style?: object;
  topStyle?: object;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        paddingBottom: "8px",
        paddingTop: "7px",
        ...style,
      }}
    >
      <p style={{ marginBottom: "12px", ...topStyle }}>Get started on NowScripts</p>
      <Link
        to="/signin/new"
        style={{
          backgroundColor: "#1a8917",
          color: "white",
          border: "none",
          outline: "none",
          borderRadius: "17px",
          padding: "8px 12px",
          fontSize: "14px",
          textDecoration: "none",
          width: "170px",
          textAlign: "center",
          ...style,
        }}
      >
        Sign up
      </Link>
      <Link
        to="/signin/in"
        style={{
          border: "1px solid gray",
          outline: "transparent",
          background: "transparent",
          borderRadius: "17px",
          padding: "7px 12px",
          color: "gray",
          marginRight: "-5px",
          fontSize: "14px",
          textDecoration: "none",
          width: "170px",
          textAlign: "center",
          ...style,
        }}
      >
        Sign In
      </Link>
    </div>
  );
}
