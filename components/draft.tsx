// import React from "react";
// import Image from "next/image";
// import ProfilePic from "@/assets/images/profile_pic.jpg";
// import BookIcon from "@/assets/icons/book.svg";
// import { useAppDispatch } from "@/redux/store";
// import { deletePost } from "@/redux/slices/posts";
// import { formatDateTimeShort } from "@/utils/date";
// import calculateReadingTime from "@/utils/reading_time";
// import { parse } from "date-fns";

// const DraftPost = ({ post, user }: any) => {
//     const readingTime = calculateReadingTime(post?.content) + " mins";

//     // const handleDelete = () => {
//     //     dispatch(deletePost(post.post_id));
//     // };

//     return (
//         <div key={post?.post_id} className="border-b-2 border-b-slate-700 p-2 sm:p-4">
//             <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
//                 <Image src={ProfilePic} alt="profile pic" className="rounded-full" />
//                 <div className="flex flex-col gap-3">
//                     <h4 className="font-medium text-2xl text-tertiary">
//                         {user?.first_name} {user?.last_name}
//                     </h4>
//                     <p className="text-tertiary-50 capitalize">
//                         {user?.join_as ?? "Unknown"},{" "}
//                         <span className="font-medium">
//                             {formatDateTimeShort(post?.created_at) ?? "Some time ago"}
//                         </span>
//                     </p>
//                 </div>
//             </div>
//             <div className="flex flex-col gap-4 my-8">
//                 <h3 className="font-semibold text-2xl md:text-4xl text-tertiary">{post?.title}</h3>
//                 <h6 className="flex gap-2 items-center text-tertiary-50 text-sm">
//                     <span>
//                         <Image src={BookIcon} alt="book icon" />
//                     </span>{" "}
//                     {readingTime}
//                 </h6>
//                 {/* <div className="text-tertiary-50">{parse(post?.content ?? "")}</div> */}
//             </div>
//             <button
//                 className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
//                 // onClick={handleDelete}
//             >
//                 Delete
//             </button>
//         </div>
//     );
// };

// export default DraftPost;
