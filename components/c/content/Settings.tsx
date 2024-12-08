"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Button, Divider, Input } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

import MatrixService from "@/services/MatrixService";

import AvatarSettings from './AvatarSettings';

interface SettingsInfo {
    oldPassword: string;
    newPassword: string;
    avatar: File | null;
    displayName: string;
}

export default function Settings() {
  const router = useRouter();
  const [isOldPwdVisible, setIsOldPwdVisible] = useState(false);
  const [isNewPwdVisible, setIsNewPwdVisible] = useState(false);
  const [settingsInfo, setSettingsInfo] = useState<SettingsInfo>({
    oldPassword: "",
    newPassword: "",
    avatar: null,
    displayName: "",
  });

  const toggleOldPwdVisibility = () => setIsOldPwdVisible(!isOldPwdVisible);
  const toggleNewPwdVisibility = () => setIsNewPwdVisible(!isNewPwdVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettingsInfo({
      ...settingsInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleChgPwdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await MatrixService.changePassword(
        settingsInfo.oldPassword,
        settingsInfo.newPassword,
      );
      toast.success("Password change successful!");
      MatrixService.logout();
      router.push("/login"); // Redirect to login page after changing password
    } catch (error: any) {
      toast.error(error.message || "Password change failed. Please try again.");
    }
  };

  const handleImageUpload = (file: File | null) => {
    setSettingsInfo({
      ...settingsInfo,
      avatar: file,
    });
  };

  const handleChgAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (settingsInfo.avatar) {
        await MatrixService.changeAvatar(settingsInfo.avatar);
      } else {
        toast.error("Please select an avatar to upload.");
      }
      toast.success("Avatar change successful!");
    } catch (error: any) {
      toast.error(error.message || "Avatar change failed. Please try again.");
    }
  }

  const handleChgDisplayNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await MatrixService.changeDisplayName(settingsInfo.displayName);
      toast.success("Display name change successful!");
    } catch (error: any) {
      toast.error(error.message || "Display name change failed. Please try again.");
    }
  };

  const isValidPassword = (password: string) => {
    return password.trim().length > 0;
  };
  
  return (
    <div className="flex items-center justify-center mt-16">
      <Card className="min-w-96 shadow border-1 dark:border-0">
        <CardHeader className="flex flex-row justify-center">
          <button
            aria-label="back"
            className="absolute left-3 focus:outline-none"
            onClick={() => router.back()}>Back</button>
          <p className="text-md text-2xl">Settings</p>
        </CardHeader>
        <Divider />
        <CardBody className="w-full flex flex-col gap-3">
          <p>Password change</p>
          <form className="flex flex-col gap-3" onSubmit={handleChgPwdSubmit}>
            <Input
              isRequired
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleOldPwdVisibility}
                >
                  {isOldPwdVisible ? (
                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="Password"
              name="oldPassword"
              placeholder="Enter your password"
              size="sm"
              type={isOldPwdVisible ? "text" : "password"}
              value={settingsInfo.oldPassword}
              onChange={handleChange}
            />
            <Input
              isRequired
              endContent={
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleNewPwdVisibility}
                >
                  {isNewPwdVisible ? (
                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              label="New Password"
              name="newPassword"
              placeholder="Enter your new password"
              size="sm"
              type={isNewPwdVisible ? "text" : "password"}
              value={settingsInfo.newPassword}
              onChange={handleChange}
            />
            <Button
              className="w-full"
              color="primary"
              isDisabled={
                !isValidPassword(settingsInfo.oldPassword)
                || !isValidPassword(settingsInfo.newPassword)
                || settingsInfo.oldPassword == settingsInfo.newPassword
              }
              size="sm"
              type="submit"
            >
              Change Password
            </Button>
          </form>
          <Divider />
          <p>Avatar change</p>
          <form className="flex flex-col gap-3" onSubmit={handleChgAvatarSubmit}>
            <AvatarSettings onImageUpload={handleImageUpload} />
            <Button className="w-full" color="primary" size="sm" type="submit">
              Change Avatar
            </Button>
          </form>
          <Divider />
          <p>Display name change</p>
          <form className="flex flex-col gap-3" onSubmit={handleChgDisplayNameSubmit}>
            <Input
              isRequired
              label="Display Name"
              name="displayName"
              placeholder="Enter your new display name"
              size="sm"
              value={settingsInfo.displayName}
              onChange={handleChange}
            />
            <Button className="w-full" color="primary" size="sm" type="submit">
              Change Display Name
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
