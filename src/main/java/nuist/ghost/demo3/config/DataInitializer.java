package nuist.ghost.demo3.config;

import nuist.ghost.demo3.entities.Member;
import nuist.ghost.demo3.entities.President;
import nuist.ghost.demo3.entities.RegularMember;
import nuist.ghost.demo3.entities.SectionHead;
import nuist.ghost.demo3.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public void run(String... args) throws Exception {
        // 清空现有数据
        memberRepository.deleteAll();

        // 2. 重置 H2 的自增/序列，确保下一次插入从 1 开始
        try {
            jdbc.execute("ALTER SEQUENCE IF EXISTS hibernate_sequence RESTART WITH 0");
        } catch (DataAccessException ignored) {}

        // 创建测试数据
        RegularMember regularMember = new RegularMember("张三", "2021001");
        regularMember.setInterviewScore(85.0);


        SectionHead sectionHead = new SectionHead("李四", "2021002");
        sectionHead.setInternshipScore(90.0);

        President president = new President("王五", "2021003");
        president.setSalaryScore(95.0);

        // 保存到数据库
        memberRepository.save(regularMember);
        memberRepository.save(sectionHead);
        memberRepository.save(president);

        System.out.println("测试数据初始化完成！");
        System.out.println("创建了 " + memberRepository.count() + " 个成员");
    }
}
