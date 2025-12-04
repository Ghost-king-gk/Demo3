package nuist.ghost.demo3.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("PRESIDENT") //在数据库member_type列中存储的值
public class President extends Member {
    public President() {

    }

    public President(String name, String studentID) {
        super(name, studentID);
    }

    @Override
    public String getMemberType() {
        return "主席";
    }
}
