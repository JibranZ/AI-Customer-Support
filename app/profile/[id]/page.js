export default function userProfile({ params }) {
  return (
    <div>
      <h1>Profile</h1>
      <hr />
      <p>Profile Page</p>
      <span>{params.id}</span>
    </div>
  );
}
