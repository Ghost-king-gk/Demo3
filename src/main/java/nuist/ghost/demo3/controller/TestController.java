package nuist.ghost.demo3.controller;

import nuist.ghost.demo3.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Autowired
    private MemberRepository memberRepository;

    @GetMapping("/test")     //测试接口，返回应用运行状态和成员数量 GetMapping 注解表示该方法处理GET请求到 /test 路径
    public String test() {
        long count = memberRepository.count();
        return "Spring Boot应用运行正常！当前有 " + count + " 个成员在数据库中。";
    }

    @GetMapping("/members")
    public Object getAllMembers() {
        return memberRepository.findAll();
    }

    @GetMapping("/member/{id}")
    public Object getMemberById(@PathVariable Long id) {
        return memberRepository.findById(id);
    }
}
