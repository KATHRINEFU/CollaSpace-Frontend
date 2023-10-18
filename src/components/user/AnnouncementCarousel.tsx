import React from "react";
import { Card, Carousel } from "antd";
import moment from "moment";
import { IAnnouncement } from "../../types";

interface AnnouncementCarouselProps {
  announcementList: IAnnouncement[];
}

const AnnouncementCarousel: React.FC<AnnouncementCarouselProps> = ({
  announcementList,
}) => {
  // Sort the announcementList by creationDate (newest first)
  const sortedAnnouncements = announcementList.slice().sort((a, b) => {
    return moment(b.creationDate).valueOf() - moment(a.creationDate).valueOf();
  });

  // Take the first five announcements
  const announcementsToShow = sortedAnnouncements.slice(0, 5);

  return (
    <Carousel dots={true}>
      {announcementsToShow.map((announcement, index) => (
        <div key={index}>
          <Card style={{ background: "#D2E0FB", height: "180px" }}>
            <div className="text-base">{announcement.content}</div>
            <p className="text-sm text-right">{announcement.creatorName}</p>
            <p className="text-sm text-right">{announcement.teamName}</p>
            <p className="text-sm text-right">
              {moment(announcement.creationDate).format('LLL')}
            </p>
          </Card>
        </div>
      ))}
    </Carousel>
  );
};

export default AnnouncementCarousel;
