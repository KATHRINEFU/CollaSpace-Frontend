import React from "react";
import { Card, Carousel } from "antd";
import moment from "moment";

interface Announcement {
  content: string;
  creator: string;
  creationDate: string;
}

interface AnnouncementCarouselProps {
  announcementList: Announcement[];
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
          <Card style={{ background: "#D2E0FB", height: "150px" }}>
            <div className="text-base">{announcement.content}</div>
            <p className="text-sm text-right">{announcement.creator}</p>
            <p className="text-sm text-right">
              {moment(announcement.creationDate).format("MMMM D, YYYY")}
            </p>
          </Card>
        </div>
      ))}
    </Carousel>
  );
};

export default AnnouncementCarousel;
