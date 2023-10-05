import { useQuery } from "@apollo/client";
import PostCard from "../components/Card";
import { Link } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import { GET_PERSONALIZED_POSTS } from "../graphql/queries";
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    // Get the current userId from the token
    const token = localStorage.getItem('id_token');
    const decodedToken = jwt_decode(token);

    // if the token is expired, logout and redirect to login page
    if (decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem('id_token');
        navigate.push('/login');
    }

    const currentUserId = decodedToken.data._id;

    const { loading, error, data } = useQuery(GET_PERSONALIZED_POSTS, {
        variables: { userId: currentUserId }
    });

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

    const posts = data.userFeed;

    return (
        <div className="flex flex-col items-center mt-8 md:mt-24">


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
