import { useQuery } from "@apollo/client";
import PostCard from "../components/Card";
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { GET_PERSONALIZED_POSTS } from "../graphql/queries";

export default function Home() {
    // Get the current userId from the token
    const token = localStorage.getItem('id_token');
    const decodedToken = jwt_decode(token);
    const currentUserId = decodedToken.data._id;

    const { loading, error, data } = useQuery(GET_PERSONALIZED_POSTS, {
        variables: { userId: currentUserId }
    });

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

    const posts = data.userFeed;

    return (
        <div className="flex flex-col items-center mt-4 md:mt-16">

            <div className="mb-4">
                <Link to="/createpost">
                    <button className="bg-gray-700 text-white p-2 rounded-lg flex items-center">
                        Add Post
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                    </button>
                </Link>
            </div>
            <div className="flex flex-wrap justify-around w-full">
  <div className="overflow-y-auto overflow-x-hidden h-[80%] relative lg:items-start lg:justify-start items-center justify-center flex flex-col gap-y-0 lg:gap-y-4">
    {posts.map((post) => (
      <PostCard key={post._id} post={post} likes={post.likes} />
    ))}
  </div>
</div>

        </div>
    );
}
