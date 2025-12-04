package nuist.ghost.demo3.repository;

import nuist.ghost.demo3.entities.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    // 通过学号查询
    Optional<Member> findByStudentID(String studentID);

    // 通过姓名查询
    List<Member> findByName(String name);

    //通过是否为实习期查询
    List<Member> findByIsProbation(boolean isProbation);

    //根据实习分大于某个值查询
    List<Member> findByInternshipScoreGreaterThan(double score);



/// =================================================================================================
    //自定义查询：查找某个特定类型的所有成员
    @Query("SELECT m FROM Member m WHERE TYPE(m) = :memberClass") // 使用JPA的@Query注解
    // 含义是：从Member实体中选择所有类型为指定类型的成员
    // :memberClass是一个参数，表示要查询的成员类型
    // TYPE(m)用于获取实体的实际类型
    // 这个查询可以用来查找所有特定子类的成员，例如所有SectionHead或President
    // 注意：这个查询返回的是Member对象，而不是子类的对象
    // 如果需要返回子类的对象，需要使用子类的查询方法
    ///* 例如：List<SectionHead> sectionHeads = memberRepository.findByMemberType(SectionHead.class);
    ///*           -----↑-----此处需要修改为对应的子类

    List<Member> findByMemberType(@Param("memberClass") Class<? extends Member> memberClass);// 泛型参数表示要查询的成员类型
    // 含义是: 查找所有指定类型的成员
    // @Param注解用于将方法参数绑定到查询中的参数
    // 泛型参数Class<? extends Member>表示传入的参数必须是Member类的子类
/// =================================================================================================



    // 检查某个学号的成员是否存在
    boolean existsByStudentID(String studentID);
}
