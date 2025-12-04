package nuist.ghost.demo3.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name = "members")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "member_type", discriminatorType = DiscriminatorType.STRING, length = 20)
@SequenceGenerator(name = "member_seq", sequenceName = "hibernate_sequence", initialValue = 0, allocationSize = 1)
public abstract class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO , generator = "member_seq")
    private Long id;

    @Column(name = "name", nullable = false , length = 100)
    private String name;

    @Column(name = "student_id", nullable = false, length = 12)
    private String studentID;

    @Column(name = "is_probation", nullable = false)
    private boolean isProbation;//是否为实习期

    @Column(name = "interview_score", nullable = false)
    private double interviewScore;//面试分

    @Column(name = "internship_score", nullable = false)
    private double internshipScore;//实习分

    @Column(name = "salary_score", nullable = false)
    private double salaryScore; //工分


    protected Member() {
        this.isProbation = true;
        // 默认构造函数
    }


    public Member(String name, String studentID) {
        this.name = name;
        this.studentID = studentID;
        this.isProbation = true;
    }

    @Transient  // 不会被持久化到数据库
    public abstract String getMemberType();

    @Transient
    public String getInfo() {
        return String.format(
                """
                        姓名：%s
                        学号：%s
                        是否为实习期：%s
                        面试分：%.2f
                        实习分：%.2f
                        工分：%.2f
                        职位：%s""",
                name, studentID, isProbation, interviewScore, internshipScore, salaryScore, getMemberType()
        );
    }

    @Override
    public String toString() {
        return String.format(
                "Member[id=%d, name='%s', studentID='%s', type='%s']",
                id, name, studentID, getMemberType()
        );
    }
}
