import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {AiFillMessage} from "react-icons/ai";
import Image from "next/image";
import axios from "axios";

export default function SetupProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState<null | string>(null);
  const [image, setImage] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>)=> {
    const file = e.target.files?.[0];

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();

    if (loading) return;

    if (!name || !bio || !image) {
      toast("Please fill in all fields and select an avatar.", {
        style: {
          background: "#9810fa",
          color: "white",
        }
      });
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("avatar", image as File);

      await axios.post("api/auth/setup-profile", formData);
      toast("Profile updated successfully", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });

      router.replace("/chat");
    } catch (error) {
      console.log(error);
      toast("Something went wrong", {
        style: {
          background: "#9810fa",
          color: "white",
        },
      });
    }
    setLoading(false)
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-[350px] w-[95%]">
        <div className="flex justify-center text-indigo-600">
          <AiFillMessage size={50} />
        </div>
        <h2 className="text-center text-3xl font-bold my-6 text-gray-300">
          Setup Profile
        </h2>
        <div className="py-10 px-6 rounded-lg  shadow-md">
          <div className="flex justify-center">
            {imagePreview && (
              <Image
                src={imagePreview}
                alt={"uploaded-image"}
                width={1000}
                height={1000}
                className="h-35 w-35 rounded-full object-cover"
              />
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              placeholder={"Name"}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 placeholder-text-gray-400 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder={"Bio"}
              className="w-full px-4 resize-none py-3 placeholder-text-gray-400 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
            />
              <label className={"text-gray-400"}>Profile Picture</label>
              <input
                type="file"
                onChange={handleImage}
                className="w-full px-4 py-3 placeholder-text-gray-400 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
              />
            <button className={"w-full bg-gradient-to-r from-blue-500 to-purple-600 my-2 py-2 text-white rounded-lg cursor-pointer hover:from-blue-600 transition"}>
              {loading ? "Updating Profile" : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )

}