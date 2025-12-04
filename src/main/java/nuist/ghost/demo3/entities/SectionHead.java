package nuist.ghost.demo3.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SECTION_HEAD") //在数据库member_type列中存储的值
public class SectionHead extends Member{
    public SectionHead() {

    }

    public SectionHead(String name, String studentID) {
        super(name, studentID);
    }

    @Override
    public String getMemberType() {
        return "部长";
    }
}
