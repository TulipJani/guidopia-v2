import RazorpayButton from './RazorpayButton';

export default function CourseCard({ course }) {
  return (
    <div style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
      <h3>{course.name}</h3>
      <p>{course.description}</p>
      <RazorpayButton amount={course.price} courseId={course.id} courseName={course.name} />
    </div>
  );
}
