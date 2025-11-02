from manim import *
import numpy as np

class AngleProblemSolver(Scene):
    def construct(self):
        # Complete animation solving multiple angle problems
        self.solve_triangle_angles()
        self.wait(2)
        self.clear()
        
        self.solve_parallel_lines()
        self.wait(2)
        self.clear()
        
        self.solve_polygon_angles()
        self.wait(2)
        self.clear()
        
        self.final_summary()

    def solve_triangle_angles(self):
        """Solve for unknown angles in a triangle"""
        # Title
        title = Text("Problem 1: Triangle Angle Mystery", font_size=36, color=YELLOW)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Problem statement
        problem_text = Text(
            "Find angle C in triangle ABC where:\nAngle A = 65°\nAngle B = 48°\nAngle C = ?",
            font_size=20,
            color=WHITE
        ).to_edge(LEFT).shift(UP * 2)
        
        self.play(Write(problem_text))
        self.wait(1)
        
        # Draw triangle
        triangle_vertices = [
            np.array([2, -1, 0]),    # A
            np.array([5, -1, 0]),    # B  
            np.array([3.5, 1.5, 0])  # C
        ]
        
        triangle = Polygon(*triangle_vertices, color=BLUE, stroke_width=3)
        self.play(Create(triangle))
        
        # Label vertices
        label_A = Text("A", font_size=20, color=WHITE).next_to(triangle_vertices[0], DOWN)
        label_B = Text("B", font_size=20, color=WHITE).next_to(triangle_vertices[1], DOWN)
        label_C = Text("C", font_size=20, color=WHITE).next_to(triangle_vertices[2], UP)
        
        self.play(Write(label_A), Write(label_B), Write(label_C))
        
        # Show known angles
        angle_A = Arc(
            radius=0.5,
            start_angle=0,
            angle=np.arctan2(triangle_vertices[2][1] - triangle_vertices[0][1], 
                           triangle_vertices[2][0] - triangle_vertices[0][0]),
            arc_center=triangle_vertices[0],
            color=RED
        )
        
        angle_B = Arc(
            radius=0.5,
            start_angle=PI,
            angle=-np.arctan2(triangle_vertices[2][1] - triangle_vertices[1][1], 
                            triangle_vertices[2][0] - triangle_vertices[1][0]) + PI,
            arc_center=triangle_vertices[1],
            color=RED
        )
        
        self.play(Create(angle_A), Create(angle_B))
        
        # Label known angles
        angle_A_label = Text("65°", font_size=16, color=RED).next_to(angle_A, RIGHT, buff=0.1)
        angle_B_label = Text("48°", font_size=16, color=RED).next_to(angle_B, LEFT, buff=0.1)
        
        self.play(Write(angle_A_label), Write(angle_B_label))
        
        # Show the unknown angle
        angle_C = Arc(
            radius=0.5,
            start_angle=-PI/2,
            angle=PI/3,
            arc_center=triangle_vertices[2],
            color=GREEN
        )
        
        self.play(Create(angle_C))
        angle_C_label = Text("?", font_size=20, color=GREEN).next_to(angle_C, DOWN, buff=0.1)
        self.play(Write(angle_C_label))
        
        # Solution steps
        solution_title = Text("Solution:", font_size=24, color=YELLOW).to_edge(LEFT).shift(DOWN * 0.5)
        self.play(Write(solution_title))
        
        step1 = Text("Step 1: Sum of angles in triangle = 180°", font_size=18, color=WHITE)
        step1.next_to(solution_title, DOWN, aligned_edge=LEFT)
        self.play(Write(step1))
        
        step2 = Text("Step 2: A + B + C = 180°", font_size=18, color=WHITE)
        step2.next_to(step1, DOWN, aligned_edge=LEFT)
        self.play(Write(step2))
        
        step3 = Text("Step 3: 65° + 48° + C = 180°", font_size=18, color=WHITE)
        step3.next_to(step2, DOWN, aligned_edge=LEFT)
        self.play(Write(step3))
        
        step4 = Text("Step 4: 113° + C = 180°", font_size=18, color=ORANGE)
        step4.next_to(step3, DOWN, aligned_edge=LEFT)
        self.play(Write(step4))
        
        step5 = Text("Step 5: C = 180° - 113° = 67°", font_size=18, color=GREEN)
        step5.next_to(step4, DOWN, aligned_edge=LEFT)
        self.play(Write(step5))
        
        # Update the answer
        final_angle_C_label = Text("67°", font_size=16, color=GREEN).move_to(angle_C_label.get_center())
        self.play(Transform(angle_C_label, final_angle_C_label))
        
        # Highlight the answer
        answer_box = SurroundingRectangle(step5, color=GREEN, buff=0.1)
        self.play(Create(answer_box))
        
        self.wait(3)

    def solve_parallel_lines(self):
        """Solve for angles formed by parallel lines and a transversal"""
        # Title
        title = Text("Problem 2: Parallel Lines & Transversal", font_size=36, color=YELLOW)
        title.to_edge(UP)
        self.play(Write(title))
        
        # Problem setup
        problem_text = Text(
            "Lines AB and CD are parallel.\nFind angle x if angle 1 = 125°",
            font_size=20,
            color=WHITE
        ).to_edge(LEFT).shift(UP * 2)
        
        self.play(Write(problem_text))
        
        # Draw parallel lines
        line1 = Line(LEFT * 3, RIGHT * 3, color=BLUE).shift(UP * 1)
        line2 = Line(LEFT * 3, RIGHT * 3, color=BLUE).shift(DOWN * 1)
        
        # Draw transversal
        transversal = Line(LEFT * 2 + UP * 2, RIGHT * 2 + DOWN * 2, color=RED)
        
        self.play(Create(line1), Create(line2), Create(transversal))
        
        # Label lines
        line1_label = Text("AB", font_size=16, color=BLUE).next_to(line1, RIGHT)
        line2_label = Text("CD", font_size=16, color=BLUE).next_to(line2, RIGHT)
        transversal_label = Text("Transversal", font_size=16, color=RED).next_to(transversal, UR)
        
        self.play(Write(line1_label), Write(line2_label), Write(transversal_label))
        
        # Mark intersection points
        intersection1 = line1.get_center() + LEFT * 0.5
        intersection2 = line2.get_center() + RIGHT * 0.5
        
        dot1 = Dot(intersection1, color=YELLOW)
        dot2 = Dot(intersection2, color=YELLOW)
        self.play(Create(dot1), Create(dot2))
        
        # Show angle 1 (given)
        angle1 = Arc(
            radius=0.4,
            start_angle=0,
            angle=2.18,  # 125 degrees in radians
            arc_center=intersection1,
            color=ORANGE
        )
        self.play(Create(angle1))
        
        angle1_label = Text("125°", font_size=14, color=ORANGE).next_to(angle1, RIGHT, buff=0.1)
        self.play(Write(angle1_label))
        
        # Show angle x (unknown)
        angle_x = Arc(
            radius=0.4,
            start_angle=PI,
            angle=0.96,  # 55 degrees
            arc_center=intersection2,
            color=GREEN
        )
        self.play(Create(angle_x))
        
        angle_x_label = Text("x", font_size=16, color=GREEN).next_to(angle_x, LEFT, buff=0.1)
        self.play(Write(angle_x_label))
        
        # Solution
        solution_title = Text("Solution:", font_size=24, color=YELLOW).to_edge(LEFT).shift(DOWN * 0.5)
        self.play(Write(solution_title))
        
        step1 = Text("Step 1: Identify alternate interior angles", font_size=18, color=WHITE)
        step1.next_to(solution_title, DOWN, aligned_edge=LEFT)
        self.play(Write(step1))
        
        step2 = Text("Step 2: Alternate interior angles are equal", font_size=18, color=WHITE)
        step2.next_to(step1, DOWN, aligned_edge=LEFT)
        self.play(Write(step2))
        
        step3 = Text("Step 3: Angle 1 and angle x are supplementary", font_size=18, color=WHITE)
        step3.next_to(step2, DOWN, aligned_edge=LEFT)
        self.play(Write(step3))
        
        step4 = Text("Step 4: 125° + x = 180°", font_size=18, color=ORANGE)
        step4.next_to(step3, DOWN, aligned_edge=LEFT)
        self.play(Write(step4))
        
        step5 = Text("Step 5: x = 180° - 125° = 55°", font_size=18, color=GREEN)
        step5.next_to(step4, DOWN, aligned_edge=LEFT)
        self.play(Write(step5))
        
        # Update answer
        final_x_label = Text("55°", font_size=14, color=GREEN).move_to(angle_x_label.get_center())
        self.play(Transform(angle_x_label, final_x_label))
        
        # Highlight answer
        answer_box = SurroundingRectangle(step5, color=GREEN, buff=0.1)
        self.play(Create(answer_box))
        
        self.wait(3)

    def solve_polygon_angles(self):
        """Solve for angles in a polygon"""
        # Title
        title = Text("Problem 3: Pentagon Interior Angles", font_size=36, color=YELLOW)
        title.to_edge(UP)
        self.play(Write(title))
        
        # Problem
        problem_text = Text(
            "Find the sum of interior angles\nof a regular pentagon",
            font_size=20,
            color=WHITE
        ).to_edge(LEFT).shift(UP * 2)
        
        self.play(Write(problem_text))
        
        # Draw pentagon
        pentagon = RegularPolygon(n=5, radius=2, color=PURPLE).shift(RIGHT * 2)
        self.play(Create(pentagon))
        
        # Label vertices
        vertices = pentagon.get_vertices()
        labels = ["A", "B", "C", "D", "E"]
        vertex_labels = []
        
        for i, (vertex, label) in enumerate(zip(vertices, labels)):
            label_obj = Text(label, font_size=16, color=WHITE)
            # Position labels outside the pentagon
            direction = vertex / np.linalg.norm(vertex) * 0.3
            label_obj.move_to(vertex + direction)
            vertex_labels.append(label_obj)
        
        self.play(*[Write(label) for label in vertex_labels])
        
        # Show interior angles
        angles = []
        for i in range(5):
            angle_arc = Arc(
                radius=0.3,
                start_angle=i * 2 * PI / 5 - PI/5,
                angle=2 * PI / 5,
                arc_center=vertices[i],
                color=RED
            )
            angles.append(angle_arc)
        
        self.play(*[Create(angle) for angle in angles])
        
        # Solution
        solution_title = Text("Solution:", font_size=24, color=YELLOW).to_edge(LEFT).shift(DOWN * 1)
        self.play(Write(solution_title))
        
        step1 = Text("Step 1: Use formula (n-2) × 180°", font_size=18, color=WHITE)
        step1.next_to(solution_title, DOWN, aligned_edge=LEFT)
        self.play(Write(step1))
        
        step2 = Text("Step 2: Pentagon has n = 5 sides", font_size=18, color=WHITE)
        step2.next_to(step1, DOWN, aligned_edge=LEFT)
        self.play(Write(step2))
        
        step3 = Text("Step 3: (5-2) × 180° = 3 × 180°", font_size=18, color=ORANGE)
        step3.next_to(step2, DOWN, aligned_edge=LEFT)
        self.play(Write(step3))
        
        step4 = Text("Step 4: Sum = 540°", font_size=18, color=GREEN)
        step4.next_to(step3, DOWN, aligned_edge=LEFT)
        self.play(Write(step4))
        
        step5 = Text("Step 5: Each angle = 540° ÷ 5 = 108°", font_size=18, color=GREEN)
        step5.next_to(step4, DOWN, aligned_edge=LEFT)
        self.play(Write(step5))
        
        # Label each angle
        for i, angle in enumerate(angles):
            angle_label = Text("108°", font_size=12, color=GREEN)
            angle_label.move_to(vertices[i] + vertices[i]/np.linalg.norm(vertices[i]) * 0.7)
            self.play(Write(angle_label), run_time=0.3)
        
        # Highlight answer
        answer_box = SurroundingRectangle(VGroup(step4, step5), color=GREEN, buff=0.1)
        self.play(Create(answer_box))
        
        self.wait(3)

    def final_summary(self):
        """Summary of all problems solved"""
        title = Text("Angle Problems: SOLVED! ✓", font_size=40, color=YELLOW)
        title.to_edge(UP)
        self.play(Write(title))
        
        # Summary boxes
        summary_items = [
            {
                "title": "Triangle Angles",
                "content": "Sum = 180°\nAngle C = 67°",
                "color": BLUE
            },
            {
                "title": "Parallel Lines",
                "content": "Supplementary angles\nx = 55°",
                "color": RED
            },
            {
                "title": "Pentagon Angles",
                "content": "Sum = 540°\nEach = 108°",
                "color": PURPLE
            }
        ]
        
        summary_group = VGroup()
        for i, item in enumerate(summary_items):
            box = Rectangle(
                width=3.5,
                height=2,
                color=item["color"],
                fill_opacity=0.2,
                stroke_width=2
            )
            
            title_text = Text(item["title"], font_size=18, color=item["color"], weight=BOLD)
            content_text = Text(item["content"], font_size=14, color=WHITE)
            
            title_text.move_to(box.get_top() + DOWN * 0.3)
            content_text.move_to(box.get_center() + DOWN * 0.2)
            
            item_group = VGroup(box, title_text, content_text)
            item_group.move_to(LEFT * 4 + RIGHT * i * 4)
            summary_group.add(item_group)
        
        self.play(*[DrawBorderThenFill(item) for item in summary_group])
        self.wait(1)
        
        # Key formulas
        formulas_title = Text("Key Formulas:", font_size=24, color=YELLOW).shift(DOWN * 1.5)
        self.play(Write(formulas_title))
        
        formulas = [
            "Triangle: A + B + C = 180°",
            "Polygon: (n-2) × 180°",
            "Supplementary: α + β = 180°"
        ]
        
        formula_group = VGroup()
        for i, formula in enumerate(formulas):
            formula_text = Text(formula, font_size=16, color=WHITE)
            formula_text.move_to(DOWN * 2.5 + DOWN * i * 0.4)
            formula_group.add(formula_text)
        
        self.play(*[Write(formula) for formula in formula_group], lag_ratio=0.3)
        
        # Final celebration
        celebration_text = Text("🎉 Master of Angles! 🎉", font_size=32, color=GREEN)
        celebration_text.to_edge(DOWN)
        self.play(Write(celebration_text))
        
        # Fireworks effect
        fireworks = []
        for _ in range(8):
            star = Star(color=random_color(), fill_opacity=0.8)
            star.scale(0.2).move_to([
                np.random.uniform(-6, 6),
                np.random.uniform(-3, 3),
                0
            ])
            fireworks.append(star)
        
        self.play(*[FadeIn(star) for star in fireworks])
        self.play(*[star.animate.scale(3).fade(1) for star in fireworks])
        
        self.wait(3)

# Run with: manim -pql angle_problem_solver.py AngleProblemSolver
